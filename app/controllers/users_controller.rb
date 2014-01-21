#encoding: utf-8
class UsersController < ApplicationController

  PER_PAGE_COUNT = 10
  USER_NUMBER_INIT = 0

  def login
    reset_session_of_user_and_answer
    if current_user
      current_user_is_admin
    end
  end

  def register
    reset_session_of_user_and_answer
    if current_user
      redirect_to :login
    else
      @user =User.new
    end
  end

  def create_login_session
    user = User.find_by_name(params[:name])
    if user && user.authenticate(params[:password])
      cookies.permanent[:token] = user.token
      #current_user_is_admin
      redirect_to :user_welcome
    else
      flash[:login_error] = "用户名或密码错误"
      redirect_to login_url
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      cookies.permanent[:token] = @user.token
      redirect_to :user_welcome
    else
      render :register
    end
  end

  def user_welcome
    if !current_user || current_user.isAdmin
      redirect_to :login
    else
      @activity_infos = ActivityInfo.where(:user_name => current_user.name).order("created_at").paginate(page:params[:page],:per_page => PER_PAGE_COUNT)
      @biding = Bid.where(:user_name => current_user.name, :status => "start").first || Bid.new
      @count = USER_NUMBER_INIT
      if params[:page]
        @count = Integer(((Integer(params[:page]) - 1) * PER_PAGE_COUNT))
      end
    end
  end

  def logout
    cookies.delete(:token)
    redirect_to login_url
  end

  private
  def current_user_is_admin
    if current_user.isAdmin
      redirect_to :administrator_welcome_view
    else
      redirect_to :user_welcome
    end
  end

end